import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

// GET /api/appointments
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};

    if (search) {
      query = {
        $or: [
          { patientName: { $regex: search, $options: 'i' } },
          { doctorName: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const appointments = await Appointment.find(query).sort({ date: -1, time: 1 });

    console.log('Fetched appointments:', appointments);

    // Map _id to id for frontend
    const formattedAppointments = appointments.map((appt) => ({
      id: appt._id,
      patientName: appt.patientName,
      doctorName: appt.doctorName,
      date: appt.date,
      time: appt.time,
      status: appt.status,
      notes: appt.notes,
      createdAt: appt.createdAt,
      updatedAt: appt.updatedAt,
    }));

    res.json({ appointments: formattedAppointments, total: formattedAppointments.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// POST /api/appointments
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientName, doctorName, date, time, status, notes } = req.body;
    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    console.log('Creating appointment with data:', req.body);

    const appointment = new Appointment({ patientName, doctorName, date, time, status, notes });
    await appointment.save();
    console.log('Created appointment:', appointment);

    res.status(201).json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// PUT /api/appointments/:id
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json({
      appointment: {
        id: appointment._id,  // <-- map _id to id
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// DELETE /api/appointments/:id
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
