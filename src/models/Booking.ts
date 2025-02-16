import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        trigger: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        page: {
            type: String,
            required: true,
        },
        agency: {
            type: String,
            required: true,
        },
        booker: {
            name: {
                type: String,
                required: true,
            },
            whatsapp: {
                type: String,
                required: true,
            },
        },
        broker:{
            name: {
                type: String,
                required: true,
            },
            whatsapp: {
                type: String,
                required: true,
            },
            accompany: {
                type: String,
                required: true,
            },
        },
        property: {
            id: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            neighborhood: {
                type: String,
                required: true,
            },
        },
        services: {
            type: String,
            required: true,
        },
        schedule: {
            start: {
                day: {
                    type: String,
                    required: true,
                },
                hour: {
                    type: String,
                    required: true,
                },
            },
            end: {
                type: String,
                required: true,
            }
        },
        notes: {
            type: String,
            required: false,
        },
        rejectedReason: {
            type: String,
            required: false,
        },
        cancelledReason: {
            type: String,
            required: false,
        },
        rescheduleReason: {
            type: String,
            required: false,
        },
        serviceStatus: {
            start: {
                ok: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                day: {
                    type: String,
                    required: false,
                },
                hour: {
                    type: String,
                    required: false,
                }
            },
            end: {
                ok: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                day: {
                    type: String,
                    required: false,
                },
                hour: {
                    type: String,
                    required: false,
                },
                photo: {
                    type: Boolean,
                    required: false,
                },
                video: {
                    type: Boolean,
                    required: false,
                }
            }
        }
    }
)

// Criar o modelo
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking

