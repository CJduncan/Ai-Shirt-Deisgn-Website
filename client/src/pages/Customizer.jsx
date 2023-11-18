import React, {useState, useEffect} from 'react';
import { AnimatePresence,motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import { state } from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AiPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';




const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');

  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AiPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }


  const handleSubmit = async (type, maxRetries = 3) => {
    if (!prompt) return alert("Please enter a prompt");

    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
        try {
            setGeneratingImg(true);

            const response = await fetch('http://localhost:8080/api/v1/dalle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                })
            });

            console.log("Response status:", response.status);

            if (response.status === 200) {
                const data = await response.json();
                handleDecals(type, data); // Updated to pass the entire data object
                success = true;
            } else {
                const errorData = await response.json();
                console.error("Error from server:", errorData);
                retries++;
            }
        } catch (error) {
            console.error(error);
            retries++;
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    if (!success) {
        alert("Failed to generate image after multiple retries.");
    }
};



  const handleDecals = (type, result) => {
    let imageUrl;
    const decalType = DecalTypes[type];

    if (typeof result === 'string') {
      // Handle base64 string directly (for file input)
      if (result.startsWith('data:image/png;base64,')) {
        imageUrl = result;
      } else {
        console.error("Invalid base64 string:", result);
        alert("Base64 string is invalid");
        return;
      }
    } else if (result && Array.isArray(result.photo) && result.photo.length > 0) {
      // Handle response from OpenAI API
      const base64Data = result.photo[0].b64_json;
      if (typeof base64Data === 'string') {
        imageUrl = `data:image/png;base64,${base64Data}`;
      } else {
        console.error("Invalid base64 data from OpenAI:", base64Data);
        alert("Base64 image data from OpenAI is invalid");
        return;
      }
    } else {
      console.error("Invalid image data:", result);
      alert("Image data is undefined or invalid");
      return;
    }

    // Set the image URL to the appropriate state property
    if (decalType) {
      state[decalType.stateProperty] = imageUrl;

      if (!activeFilterTab[decalType.filterTab]) {
        handleActiveFilterTab(decalType.filterTab);
      }
    } else {
      console.error("Invalid decal type:", type);
      alert("Invalid decal type");
    }
  };





  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer