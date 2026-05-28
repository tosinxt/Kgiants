"use client";

import { useMenu } from "@/context/MenuContext";
import BubbleMenu from "./BubbleMenu";

export default function MenuSidebar() {
  const { isMenuOpen, toggleMenu } = useMenu();

  return (
    <BubbleMenu
      useFixedPosition={true}
      menuBg="#FFFFFF"
      menuContentColor="#163300"
      menuAriaLabel="Toggle navigation"
      animationEase="back.out(1.5)"
      animationDuration={0.45}
      staggerDelay={0.1}
      controlledOpen={isMenuOpen}
      onControlledToggle={toggleMenu}
      hideNav={true}
    />
  );
}
