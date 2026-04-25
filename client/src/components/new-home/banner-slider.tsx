import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

interface BannerSlide {
  id: string;
  imageUrl: string;
}
interface NewBannerSliderProps {
  slides: BannerSlide[];
}


const images = [
  "/slider-1.png",
  "/slider-2.png",
  "/slider-3.png",
  "/slider-4.png",
  "/slider-5.png",
  "/slider-6.png",
  "/slider-7.png",
  "/slider-3.png",
  "/slider-4.png",
  "/slider-5.png",
];

export function NewBannerSlider({ slides }: NewBannerSliderProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);
  const xPos = useRef(0);
  const autoRotate = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!ringRef.current || !draggerRef.current) return;

    const imgs = gsap.utils.toArray<HTMLDivElement>(".ring-img");
    const ring = ringRef.current;
    const dragger = draggerRef.current;

    // ---------- INTRO ----------
    gsap.timeline()
      .set(dragger, { opacity: 0 })
      .set(ring, { rotationY: 180 })
      .set(imgs, {
        rotateY: (i) => i * -36,
        transformOrigin: "50% 50% 1000px",
        z: -1000,
        backfaceVisibility: "hidden",
      })
      .from(imgs, {
        duration: 1.5,
        y: 200,
        opacity: 0,
        stagger: 0.1,
        ease: "expo",
      });

    // ---------- AUTOPLAY ----------
    autoRotate.current = gsap.to(ring, {
      rotationY: "+=360",
      duration: 80,
      ease: "none",
      repeat: -1,
      onUpdate: () => updateBgPos(),
    });

    // ---------- DRAG ----------
    Draggable.create(dragger, {
      onDragStart(e) {
        autoRotate.current?.pause();
        const clientX =
          "touches" in e ? e.touches[0].clientX : e.clientX;
        xPos.current = Math.round(clientX);
      },

      onDrag(e) {
        const clientX =
          "touches" in e ? e.touches[0].clientX : e.clientX;

        gsap.to(ring, {
          rotationY: "-=" + ((Math.round(clientX) - xPos.current) % 360),
          onUpdate: () => updateBgPos(),
        });

        xPos.current = Math.round(clientX);
      },

      onDragEnd() {
        gsap.set(dragger, { x: 0, y: 0 });
        autoRotate.current?.resume();
      },
    });

    function updateBgPos() {
      imgs.forEach((_, i) => {
        gsap.set(imgs[i], {
          backgroundPosition: getBgPos(i),
        });
      });
    }

    function getBgPos(i: number) {
      return (
        (-gsap.utils.wrap(
          0,
          360,
          gsap.getProperty(ring, "rotationY") as number - 180 - i * 36
        ) /
          360) *
          400 +
        "px 0px"
      );
    }
  }, []);

  return (
    // <div className="bg-white relative w-full h-[600px] overflow-hidden">
    <div
  className="
    relative
    h-[490px]
    overflow-hidden
    bg-section-white

    before:content-['']
    before:absolute
    before:bg-section-white
    before:w-[104%]
    before:h-[160px]
    before:rounded-[100%]
    before:z-10
    before:left-[-2%]
    before:top-[-75px]

    after:content-['']
    after:absolute
    after:bg-section-white
    after:w-[104%]
    after:h-[160px]
    after:rounded-[100%]
    after:z-10
    after:left-[-2%]
    after:bottom-[-75px]
  "
>

      {/* <div
        className="absolute left-1/2 top-1/2 w-[646px] h-[620px]"
        style={{
          transform: "translate(-50%, -50%)",
          perspective: "2000px",
        }}
      > */}
      <div
  className="absolute left-1/2 top-1/2 w-[646px] h-[620px] z-0"
  style={{
    transform: "translate(-50%, -50%)",
    perspective: "2000px",
  }}
>
        <div
          ref={ringRef}
          id="ring"
          className="relative w-full h-full transform-style-preserve-3d"
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="ring-img absolute w-full h-full overflow-hidden"
            >
              <img
                src={src}
                className="w-[95%] h-full object-cover mx-auto"
                alt={`slide-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Drag layer */}
      <div
        ref={draggerRef}
        className="absolute inset-0 cursor-grab"
      />
    </div>
  );
}
