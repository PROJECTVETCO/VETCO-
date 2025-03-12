"use client"

import { useState } from "react"

interface AppointmentModalProps {
  doctor: {
    name: string
  }
  isOpen: boolean
  onClose: () => void
}

export function AppointmentModal({ doctor, isOpen, onClose }: AppointmentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Book Appointment with {doctor.name}</h2>
        <form className="flex flex-col space-y-3">
          <input type="text" placeholder="Your Name" className="border p-2 rounded bg-white" required />
          <input type="email" placeholder="Your Email" className="border p-2 rounded bg-white" required />
          <input type="date" className="border p-2 rounded bg-white" required />
          <input type="time" className="border p-2 rounded bg-white" required />
          <textarea placeholder="Message (optional)" className="border p-2 rounded bg-white"></textarea>
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Submit
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-red-600 hover:underline">
          Close
        </button>
      </div>
    </div>
  )
}
