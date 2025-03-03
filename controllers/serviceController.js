const Service = require('../models/serviceModel');

// 🛠️ Admin Actions
// Create a new service
const createService = async (req, res) => {
    try {
        const { name, description, price, duration, type } = req.body;
        const newService = new Service({ name, description, price, duration, type });
        await newService.save();
        res.status(201).json({ message: 'Service created successfully', service: newService });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create service', error });
    }
};

// Update an existing service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedService = await Service.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedService) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json({ message: 'Service updated successfully', service: updatedService });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update service', error });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete service', error });
    }
};

// 🔍 User Actions
// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get services', error });
    }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get service', error });
    }
};

module.exports = {
    createService,
    updateService,
    deleteService,
    getAllServices,
    getServiceById,
};
