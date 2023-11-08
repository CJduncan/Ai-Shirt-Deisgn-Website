import Express  from "express";
import * as dotenv from 'dotenv';
import OpenAIApi from 'openai';

dotenv.config();

const router = Express.Router();



const openai = new OpenAIApi({apiKey: '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'});


router.route('/').get((req,res) => {
    res.status(200).json({message: 'hell0 from dalle'})
})

router.route('/').post(async (req,res) => {
    try{
        const {prompt } = req.body;
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            respsone_format: 'b64_json'
        });
        
        const image = response.data.data[0].b64_json;
        res.status(200).json({photo:image});
    }catch (error){
        console.log(error);
        res.status(500).json({message: 'something broke'})

    }
})

export default router;