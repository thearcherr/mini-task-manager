"use client";

import { FaAsterisk } from "react-icons/fa";
import Lenis from "lenis";
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AnimatedButton from "../ui/AnimatedButton";

export default function MainSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 480]);

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const [tabIndx, setTabIndx] = useState(-1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function doNewTask() {
    console.log("New Task:", title, description);
    if (!title || !description) {
      alert("Please fill in both title and description.");
      return;
    }
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alert(`Task Created:\nTitle: ${title}\nDescription: ${description}`);
    } else {
      alert(`Error: ${data.error}`);
    }
    setTitle("");
    setDescription("");
    loadTasksManually();
  }

  const loadTasksManually = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    console.log("Fetched tasks:", data);
    const pendingTasks = data.tasks.filter(task => task.completed === 0);
    const completed = data.tasks.filter(task => task.completed === 1);
    setTasks(pendingTasks);
    setCompletedTasks(completed);
  };

  useEffect(() => {
  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    console.log("Fetched tasks:", data);
    const pendingTasks = data.tasks.filter(task => task.completed === 0);
    const completed = data.tasks.filter(task => task.completed === 1);
    setTasks(pendingTasks);
    setCompletedTasks(completed);
  };
  fetchTasks();
}, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-4 items-center h-screen">
        <motion.span ref={ref} style={{ x, rotateZ }}>
          <FaAsterisk className="text-8xl" />
        </motion.span>
        <motion.h1
          style={{ x }}
          ref={ref}
          className="font-stack font-light text-8xl"
        >
          TASK MANAGER
        </motion.h1>
      </div>

      <div className="min-h-screen" />
      <div className="min-h-screen">
        <div className="flex flex-row gap-3 mx-4">
          <AnimatedButton
            text="New"
            index={tabIndx}
            onClick={() => {
              setIsOpen(!isOpen);
              setTabIndx(0);
            }}
          />
          <AnimatedButton
            text={`Pending (${Array.isArray(tasks) ? tasks.length : 0})`}
            index={tabIndx}
            onClick={() => {
              setIsOpen(false);
              setTabIndx(1);
            }}
          />
          <AnimatedButton
            text={`Completed (${Array.isArray(completedTasks) ? completedTasks.length : 0})`}
            index={tabIndx}
            onClick={() => {
              setIsOpen(false);
              setTabIndx(2);
            }}
          />
        </div>
        <AnimatePresence>
          {isOpen && tabIndx === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mt-10 mx-5"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Task Title"
                className="border py-3 px-4 w-92 outline-none"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="border py-3 px-4 w-92 h-40 outline-none resize-none"
              />
              <button
                onClick={() => doNewTask()}
                className="bg-black text-white py-3 px-6 w-fit cursor-pointer"
              >
                <FaPlus />
              </button>
            </motion.div>
          )}
          {tabIndx === 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mt-10 mx-5"
            >
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
                  <motion.div
                  className="border p-4 flex flex-row gap-2"
                    key={task.id}>
                    <div className="flex-1">
                      <h2 className="font-pf font-semibold text-2xl">{task.name}</h2>
                    <p className="font-pf font-light text-lg">
                      {task.description}
                    </p>
                    </div>
                    <div>
                      <AnimatedButton
                        text="Mark as Completed"
                        onClick={async () => {
                          const res = await fetch(`/api/tasks/${task.id}/complete`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ id: task.id }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            alert("Task marked as completed.");
                            const res = await fetch('/api/tasks');
                            const data = await res.json();
                            const pendingTasks = data.tasks.filter(t => t.completed === 0);
                            const completed = data.tasks.filter(t => t.completed === 1);
                            setTasks(pendingTasks);
                            setCompletedTasks(completed);
                          } else {
                            alert(`Error: ${data.error}`);
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <p>No pending tasks.</p>
              )}
            </motion.div>
          )}
          {tabIndx === 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mt-10 mx-5"
            >
              {Array.isArray(completedTasks) && completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <motion.div
                  className="border p-4 flex flex-row gap-2"
                    key={task.id}>
                    <div className="flex-1">
                      <h2 className="font-pf font-semibold text-2xl">{task.name}</h2>
                    <p className="font-pf font-light text-lg">
                      {task.description}
                    </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p>No completed tasks.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}