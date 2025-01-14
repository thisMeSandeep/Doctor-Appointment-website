import doctorModel from "../models/doctorModel.js";

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    return res.status(200).json({
      success: true,
      message: "Availability changed",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get all doctors list

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find().select(["-password", "-email"]);

    //if no doctors in DB
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No doctors found !",
      });
    }

    return res.status(200).json({
      success: true,
      message: " doctors found",
      doctors,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
