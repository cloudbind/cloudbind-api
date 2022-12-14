const fileUpload = async (req, res) => {
    try {
        if (req.files) {
            res.status(201).json({
                message: 'Files uploaded successfully!'
            });
        } else {
            res.status(400).json({
                message: 'Files upload failed!'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.mesage
        });
    }
};

module.exports = {
    fileUpload
};
