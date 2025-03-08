import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
// import image1 from "/OIP.jpg"

// Dummy data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr Okiria Jude",
    specialty: "Vaccination",
    rating: 4,
    nextAvailable: "Tomorrow 10:00 AM",
    location: "Kampala, Uganda",
    image: "/OIP.jpg",
  },
  {
    id: 2,
    name: "Dr Byaruhanga Philp",
    specialty: "Animal Nutritionist",
    rating: 5,
    nextAvailable: "Today 3:00 PM",
    location: "Entebbe, Uganda",
    image: "/R2.jpg",
  },
  {
    id: 3,
    name: "Dr Agnes Katende",
    specialty: "Veterinary Pathologist",
    rating: 4,
    nextAvailable: "Tomorrow 11:00 AM",
    location: "Jinja, Uganda",
    image: "/R3.jpg",
  },
];

const DoctorCard = ({ doctor, onClick }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center text-center w-64 cursor-pointer hover:shadow-xl transition"
      onClick={() => onClick(doctor)}
    >
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <p className="text-gray-500">{doctor.specialty}</p>
      <div className="flex justify-center my-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className="text-yellow-500">
            {index < Math.floor(doctor.rating) ? (
              <FaStar />
            ) : index < doctor.rating ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar />
            )}
          </span>
        ))}
      </div>
      <p className="text-gray-600 text-sm">
        Next Available: {doctor.nextAvailable}
      </p>
      <p className="text-gray-600 text-sm">Location: {doctor.location}</p>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Book Appointment
      </button>
    </div>
  );
};

const AppointmentModal = ({ doctor, onClose }: any) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");
  
    if (!user || !token) {
      toast({ title: "Unauthorized", description: "Please log in.", variant: "destructive" });
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          email,
          date,
          time,
          message,
          doctorId: doctor.id,
          userId: user._id, // Use _id as userId
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create appointment: ${response.statusText}`);
      }
  
      toast({ title: "✅ Appointment Created", description: "Your appointment has been scheduled.", variant: "success" });
      onClose(); // Close the modal after successful submission
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Book Appointment with {doctor.name}
        </h2>
        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded bg-white text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-2 rounded bg-white text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="date"
            className="border p-2 rounded bg-white text-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            className="border p-2 rounded bg-white text-black"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <textarea
            placeholder="Message (optional)"
            className="border p-2 rounded bg-white text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-red-600 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};

const DoctorCarousel = () => {
  const [index, setIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const itemsPerSlide = 4;

  const nextDoctors = () => {
    setIndex((prevIndex) =>
      prevIndex + itemsPerSlide < doctors.length ? prevIndex + itemsPerSlide : 0
    );
  };

  const prevDoctors = () => {
    setIndex((prevIndex) =>
      prevIndex - itemsPerSlide >= 0
        ? prevIndex - itemsPerSlide
        : doctors.length - itemsPerSlide
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prevDoctors} className="text-gray-600 text-2xl">
          ◀
        </button>
        <div className="flex space-x-4">
          {doctors.slice(index, index + itemsPerSlide).map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClick={setSelectedDoctor}
            />
          ))}
        </div>
        <button onClick={nextDoctors} className="text-gray-600 text-2xl">
          ▶
        </button>
      </div>

      {/* Appointment Modal */}
      {selectedDoctor && (
        <AppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default DoctorCarousel;
