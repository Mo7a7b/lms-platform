"use client";
import React from "react";
import { Button } from "../../ui/button";
import { AddCourseModal } from "./AddCourseModal";

const AddNewCourseButton = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div>
      <Button variant="default" onClick={() => setIsModalOpen(true)}>
        Create New Course
      </Button>
      <AddCourseModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default AddNewCourseButton;
