import express from 'express';

const router = express.Router();

router.get('/ping', async (req, res) =>{
        res.status(200).json({})
})

export default router
