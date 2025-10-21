'use client';

import React, { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';
import './FallingText.css';

/**
 * FallingText 컴포넌트 Props
 */
export interface FallingTextProps {
  /**
   * 텍스트 내용
   */
  text?: string;
  /**
   * 하이라이트할 키워드들
   */
  highlightWords?: string[];
  /**
   * 하이라이트 클래스명
   */
  highlightClass?: string;
  /**
   * 트리거 타입 ('auto' | 'scroll' | 'click' | 'hover')
   */
  trigger?: 'auto' | 'scroll' | 'click' | 'hover';
  /**
   * 배경색
   */
  backgroundColor?: string;
  /**
   * 와이어프레임 모드
   */
  wireframes?: boolean;
  /**
   * 중력 강도
   */
  gravity?: number;
  /**
   * 마우스 제약 강도
   */
  mouseConstraintStiffness?: number;
  /**
   * 폰트 크기
   */
  fontSize?: string;
}

/**
 * FallingText 컴포넌트
 * 
 * Matter.js 물리 엔진을 사용한 텍스트 애니메이션 컴포넌트입니다.
 * 중력, 마우스 상호작용, 하이라이트 효과를 지원합니다.
 * 
 * @param {FallingTextProps} props - 컴포넌트 props
 * @param {string} [props.text] - 표시할 텍스트
 * @param {string[]} [props.highlightWords] - 하이라이트할 키워드들
 * @param {string} [props.highlightClass] - 하이라이트 클래스명
 * @param {'auto' | 'scroll' | 'click' | 'hover'} [props.trigger] - 트리거 타입
 * @param {string} [props.backgroundColor] - 배경색
 * @param {boolean} [props.wireframes] - 와이어프레임 모드
 * @param {number} [props.gravity] - 중력 강도
 * @param {number} [props.mouseConstraintStiffness] - 마우스 제약 강도
 * @param {string} [props.fontSize] - 폰트 크기
 * 
 * @example
 * ```tsx
 * <FallingText
 *   text="React Bits is a library of animated and interactive React components"
 *   highlightWords={["React", "Bits", "animated", "components"]}
 *   highlightClass="highlighted"
 *   trigger="hover"
 *   backgroundColor="transparent"
 *   wireframes={false}
 *   gravity={1}
 *   fontSize="1rem"
 *   mouseConstraintStiffness={0.2}
 * />
 * ```
 */
const FallingText: React.FC<FallingTextProps> = ({
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    const newHTML = words
      .map(word => {
        const isHighlighted = highlightWords.some(hw => word.startsWith(hw));
        return `<span class="word ${isHighlighted ? 'highlighted' : ''}">${word}</span>`;
      })
      .join(' ');
    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords, highlightClass]);

  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    if (!containerRef.current || !canvasContainerRef.current || !textRef.current) return;

    // 약간의 지연을 두어 DOM이 완전히 렌더링되도록 함
    const initPhysics = () => {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const width = containerRect.width;
      const height = containerRect.height;
      const canvasContainer = canvasContainerRef.current!;

      if (width <= 0 || height <= 0) {
        console.warn('Container dimensions are invalid:', { width, height });
        return;
      }

      console.log('Initializing physics with dimensions:', { width, height });

      const engine = Engine.create();
      engine.world.gravity.y = gravity;

      const render = Render.create({
        element: canvasContainer,
        engine,
        options: {
          width,
          height,
          background: backgroundColor,
          wireframes
        }
      });

      const boundaryOptions = {
        isStatic: true,
        render: { fillStyle: 'transparent' }
      };
      const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
      const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
      const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
      const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

      const wordSpans = textRef.current!.querySelectorAll<HTMLSpanElement>('.word');
      console.log('Found word spans:', wordSpans.length);
      console.log('Text content:', textRef.current!.innerHTML);
      
      if (wordSpans.length === 0) {
        console.error('No word spans found! Check CSS class names.');
        return;
      }
      
      const wordBodies = Array.from(wordSpans).map((elem, index) => {
        const rect = elem.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;

        console.log(`Word ${index}:`, { x, y, width: rect.width, height: rect.height });

        const body = Bodies.rectangle(x, y, rect.width, rect.height, {
          render: { fillStyle: 'transparent' },
          restitution: 0.8,
          frictionAir: 0.01,
          friction: 0.2
        });

        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 5,
          y: 0
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        return { elem, body };
      });

      wordBodies.forEach(({ elem, body }) => {
        elem.style.position = 'absolute';
        elem.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x / 2}px`;
        elem.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y / 2}px`;
        elem.style.transform = 'none';
      });

      const mouse = Mouse.create(containerRef.current!);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: mouseConstraintStiffness,
          render: { visible: false }
        }
      });
      render.mouse = mouse;

      World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      const updateLoop = () => {
        wordBodies.forEach(({ body, elem }) => {
          const { x, y } = body.position;
          elem.style.left = `${x}px`;
          elem.style.top = `${y}px`;
          elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
        });
        Matter.Engine.update(engine);
        requestAnimationFrame(updateLoop);
      };
      updateLoop();

      return () => {
        Render.stop(render);
        Runner.stop(runner);
        if (render.canvas && canvasContainer) {
          canvasContainer.removeChild(render.canvas);
        }
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    // DOM이 완전히 렌더링된 후 물리 엔진 초기화
    const timeoutId = setTimeout(initPhysics, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="falling-text-container"
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
      role="main"
      aria-label="Falling text animation"
      data-testid="falling-text-container"
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{
          fontSize: fontSize,
          lineHeight: 1.4,
          color: '#000000',
          fontWeight: 600
        }}
        aria-live="polite"
        data-testid="falling-text-content"
      />
      <div 
        ref={canvasContainerRef} 
        className="falling-text-canvas"
        aria-hidden="true"
      />
    </div>
  );
};

export default FallingText;
