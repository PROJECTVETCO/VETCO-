"use client"

import { useState } from "react"
// import { postDoctor } from "@/services/DoctorService"

export function AddDoctor() {
  const [doctor, setDoctor] = useState({
    name: "",
    expertise: "",
    location: "",
    contact: "",
    availability: "",
    profilePic: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      await postDoctor(doctor)
      setSuccess(true)
      setDoctor({
        name: "",
        expertise: "",
        location: "",
        contact: "",
        availability: "",
        profilePic: "",
      })
    } catch (err) {
      setError("Failed to add doctor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add a New Doctor</h2>
      {success && <p className="text-green-500">Doctor added successfully!</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input name="name" placeholder="Doctor Name" value={doctor.name} onChange={handleChange} required className="border p-2 rounded" />
        <input name="expertise" placeholder="Expertise (e.g., Vet, Surgeon)" value={doctor.expertise} onChange={handleChange} required className="border p-2 rounded" />
        <input name="location" placeholder="Location" value={doctor.location} onChange={handleChange} required className="border p-2 rounded" />
        <input name="contact" placeholder="Contact Number" value={doctor.contact} onChange={handleChange} required className="border p-2 rounded" />
        <input name="availability" placeholder="Availability (e.g., Mon-Fri, 9AM-5PM)" value={doctor.availability} onChange={handleChange} required className="border p-2 rounded" />
        <input name="profilePic" placeholder="Profile Picture URL" value={doctor.profilePic} onChange={handleChange} required className="border p-2 rounded" />
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  )
}
