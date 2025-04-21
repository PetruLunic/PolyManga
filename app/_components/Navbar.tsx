import {forwardRef, useState, useEffect, useRef} from "react";
import {LazyMotion, m, useScroll, useMotionValueEvent, domAnimation, Variants} from "framer-motion";
import {NavbarMenu, NavbarProps, NavbarProvider, useNavbar} from "@heroui/react";
import {pickChildren} from "@heroui/react-rsc-utils";
import {mergeProps} from "@react-aria/utils";
import {TRANSITION_EASINGS} from "@heroui/framer-utils";

const SCROLL_THRESHOLD = 300;
const DEBOUNCE_TIME = 300;

const getHideOnScrollVariants: (positioning: "top" | "bottom") => Variants = (positioning) => ({
  visible: {
    y: 0,
    transition: {
      ease: TRANSITION_EASINGS.easeOut,
    },
  },
  hidden: {
    y: positioning === "top" ? "-100%" : '100%',
    height: positioning === "top" ? 'auto' : 0,
    overflow: 'hidden',
    transition: {
      ease: TRANSITION_EASINGS.easeIn,
    },
  },
});

interface CustomNavbarProps extends NavbarProps {
  positioning?: "top" | "bottom",
  scrollThreshold?: number;
}

// Modified HeroUI Navbar component, with scroll threshold attribute for hideOnScroll
const Navbar = forwardRef<HTMLElement, CustomNavbarProps>((props, ref) => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const {
    children,
    scrollThreshold = SCROLL_THRESHOLD,
    positioning = "top",
    ...otherProps
  } = props;
  const { scrollY } = useScroll();

  const context = useNavbar({...otherProps, ref});

  const Component = context.Component;

  const [childrenWithoutMenu, menu] = pickChildren(children, NavbarMenu);

  const content = (
    <>
      <header {...context.getWrapperProps()}>{childrenWithoutMenu}</header>
      {menu}
    </>
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    timeoutRef.current = setTimeout(() => {
      const currentScrollY = latest;
      const scrollDifference = currentScrollY - lastScrollY;

      if (Math.abs(scrollDifference) < scrollThreshold) return;

      if (scrollDifference > 0) { // Scroll down
        setIsHidden(true);
      } else { // Scroll up
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY > 0 ? currentScrollY : 0);
    }, DEBOUNCE_TIME)
  });

  return (
    <NavbarProvider value={context}>
      {context.shouldHideOnScroll ? (
        <LazyMotion features={domAnimation}>
          <m.nav
            animate={isHidden ? "hidden" : "visible"}
            initial={false}
            variants={getHideOnScrollVariants(positioning)}
            {...mergeProps(context.getBaseProps(), context.motionProps)}
          >
            {content}
          </m.nav>
        </LazyMotion>
      ) : (
        <Component {...context.getBaseProps()}>{content}</Component>
      )}
    </NavbarProvider>
  );
});

Navbar.displayName = "HeroUI.Navbar";

export default Navbar;