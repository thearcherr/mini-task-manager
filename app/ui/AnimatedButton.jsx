import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AnimatedButton(props) {
  const overlayVariants = {
    rest: { scaleY: 0 },
    hover: { scaleY: 1 },
  };

  const [hovered, setHovered] = useState(false);

  props.tabIndx === 0 ? setHovered(true) : null;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={props.onClick}
      className="h-fit cursor-pointer flex flex-col items-start border py-3 px-6 w-fit relative overflow-hidden"
    >
      <motion.span
        variants={overlayVariants}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute inset-0 bg-black z-10 origin-bottom"
      />
      <p className={`font-pf ${hovered ? "text-white" : "text-black"} z-50`}>
        {props.text}
      </p>
    </motion.div>
  );
}