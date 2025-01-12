import React from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

interface ReservationFormModalProps {
  book: { ITEMID: number } | null;
  open: boolean;
  onClose: () => void;
}

const ReservationFormModal: React.FC<ReservationFormModalProps> = ({ open, onClose, book }) => {
  const [formData, setFormData] = React.useState({
    date: "",
    heureEntree: "",
    heureSortie: "",
  });
  const [loading, setLoading] = React.useState(false);

  const isWeekday = (date: string) => {
    const day = new Date(date).getDay();
    return day >= 1 && day <= 5;
  };

  const isFutureDate = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHeureEntreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const heureEntree = e.target.value;
    const [hours, minutes] = heureEntree.split(":").map(Number);
    // Ensure start time is not earlier than 7 AM
    if (hours < 7) {
      alert("L'heure d'entrée ne peut pas être avant 7h.");
      return;
    }

    // Reset heureSortie if heureEntree is updated
    setFormData((prevData) => ({
      ...prevData,
      heureEntree,
      heureSortie: "", // Clear end time when start time is updated
    }));
  };

  const handleHeureSortieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const heureSortie = e.target.value;
    const [hours, minutes] = heureSortie.split(":").map(Number);

    // Ensure end time is not later than 6 PM
    if (hours > 18) {
      alert("L'heure de sortie ne peut pas être après 18h.");
      return;
    }

    // Ensure end time is after start time
    const heureEntree = formData.heureEntree;
    if (heureEntree) {
      const [startHours, startMinutes] = heureEntree.split(":").map(Number);
      const startTime = new Date().setHours(startHours, startMinutes);

      const endTime = new Date().setHours(hours, minutes);
      if (endTime <= startTime) {
        alert("L'heure de sortie doit être après l'heure d'entrée.");
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      heureSortie,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!isWeekday(selectedDate)) {
      alert("La date doit être un jour ouvré (du lundi au vendredi).");
      return;
    }
    if (!isFutureDate(selectedDate)) {
      alert("La date doit être au moins un jour après la date actuelle.");
      return;
    }
    handleChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book) {
      alert("Book information is missing.");
      return;
    }
    const userId = "test"; // You can replace this with `localStorage.getItem("user_id")`

    if (!userId) {
      alert("User ID not found in local storage. Please log in.");
      return;
    }

    const start_datetime = `${formData.date}T${formData.heureEntree}:00`;
    const end_datetime = `${formData.date}T${formData.heureSortie}:00`;

    const reservationData = {
      user_id: userId,
      start_datetime,
      end_datetime,
    };

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reservations/${book.ITEMID}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create reservation. Please try again.");
      }

      const result = await response.json();
      alert("Reservation successful!");
      console.log("Reservation Result:", result);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="reservation-form-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 400,
        }}
      >
        <h2 id="reservation-form-title">Formulaire de Réservation</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="date"
            name="date"
            label="Date de réservation"
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            inputProps={{
              min: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            id="heureEntree"
            name="heureEntree"
            label="Heure d'entrée"
            type="time"
            value={formData.heureEntree}
            onChange={handleHeureEntreeChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            inputProps={{
              min: "07:00",
              max: "18:00",
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            id="heureSortie"
            name="heureSortie"
            label="Heure de sortie"
            type="time"
            value={formData.heureSortie}
            onChange={handleHeureSortieChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            inputProps={{
              min: "07:00",
              max: "18:00",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Soumettre"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ReservationFormModal;
