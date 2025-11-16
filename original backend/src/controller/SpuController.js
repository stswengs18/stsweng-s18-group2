const Spu = require('../model/spu');

const createSpu = async (req, res) => {
    try {
        const { spu_name } = req.body;
        const existingSpu = await Spu.findOne({ spu_name: { $regex: `^${spu_name}$`, $options: "i" }, is_active:false});
        if(existingSpu){
            existingSpu.spu_name = spu_name
            existingSpu.is_active = true;
            existingSpu.createdAt = new Date();
            await existingSpu.save()
            return res.status(200).json({

                message:  "Spu reactivated and renamed",
                spu:existingSpu}    
            )
        }
        const newSpu = new Spu({spu_name});
        await newSpu.save();
        res.status(201).json(newSpu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSpu = async (req, res) => {
    try {
        const { spuId } = req.params;
        const updatedSpu = await Spu.findByIdAndUpdate(
            spuId,
            { is_active: false },
            { new: true }
        );

        if (!updatedSpu) {
            return res.status(404).json({ message: 'SPU not found' });
        }

        res.status(200).json({ message: 'SPU deactivated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSpus = async (req, res) => {
    try {
        const spus = await Spu.find();
        res.status(200).json(spus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSpu,
    deleteSpu,
    getAllSpus,
}