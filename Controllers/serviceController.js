import  Service  from '../Models/Service.js';

// Get all services
export const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({createdAt : -1});
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single service by id
export const getServiceById = async (req, res) => {
    try {
        const services = await Service.findById(req.params.id);
        if (services) {
            res.status(200).json({ serviceType: services.serviceType});
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Service
export const createService = async (req, res) => {
    const { serviceType } = req.body;

    const newService = new Service({
        serviceType        
    });

    try {
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing service
export const updateService = async (req, res) => {
    const { serviceType } = req.body;

    try {
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { serviceType },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteService = async (req, res) => {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted' });
};