"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

/**
 * 모달 아이템 인터페이스
 */
interface ModalItem {
  id: string;
  content: ReactNode;
  zIndex: number;
}

/**
 * 모달 컨텍스트 타입
 */
interface ModalContextType {
  /**
   * 모달 스택이 비어있는지 확인
   */
  isEmpty: boolean;
  /**
   * 모달 열기
   * @param content - 모달에 표시할 컨텐츠
   * @returns 모달 ID
   */
  openModal: (content: ReactNode) => string;
  /**
   * 특정 모달 닫기
   * @param id - 닫을 모달의 ID
   */
  closeModal: (id: string) => void;
  /**
   * 최상위 모달 닫기
   */
  closeTopModal: () => void;
  /**
   * 모든 모달 닫기
   */
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 모달 훅
 * @returns 모달 컨텍스트
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

/**
 * 모달 프로바이더 Props
 */
interface ModalProviderProps {
  children: ReactNode;
}

/**
 * 모달 프로바이더 컴포넌트
 * 
 * 중첩 모달을 지원하는 모달 스택 시스템을 제공합니다.
 * - 여러 모달을 동시에 열 수 있음
 * - 각 모달은 독립적인 backdrop을 가짐
 * - 모달이 열려있을 때 body 스크롤을 비활성화
 * 
 * @param {ModalProviderProps} props - 컴포넌트 props
 * @param {ReactNode} props.children - 자식 요소
 * 
 * @example
 * ```tsx
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export default function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const [nextId, setNextId] = useState(1);

  /**
   * 모달 열기
   * @param content - 모달에 표시할 컨텐츠
   * @returns 모달 ID
   */
  const openModal = (content: ReactNode): string => {
    const id = `modal-${nextId}`;
    const newModal: ModalItem = {
      id,
      content,
      zIndex: 1000 + modals.length, // 기본 z-index 1000에서 시작하여 스택 높이만큼 증가
    };
    
    setModals(prev => [...prev, newModal]);
    setNextId(prev => prev + 1);
    
    return id;
  };

  /**
   * 특정 모달 닫기
   * @param id - 닫을 모달의 ID
   */
  const closeModal = (id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };

  /**
   * 최상위 모달 닫기
   */
  const closeTopModal = () => {
    setModals(prev => prev.slice(0, -1));
  };

  /**
   * 모든 모달 닫기
   */
  const closeAllModals = () => {
    setModals([]);
  };

  /**
   * body 스크롤 제어
   */
  useEffect(() => {
    if (modals.length > 0) {
      // 모달이 열려있을 때 body 스크롤 비활성화
      document.body.style.overflow = 'hidden';
    } else {
      // 모든 모달이 닫혔을 때 body 스크롤 활성화
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modals.length]);

  const contextValue: ModalContextType = {
    isEmpty: modals.length === 0,
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {typeof window !== "undefined" &&
        modals.map((modal) =>
          createPortal(
            <div
              key={modal.id}
              className={styles.modalOverlay}
              style={{ zIndex: modal.zIndex }}
              onClick={closeTopModal}
            >
              {/* Backdrop - 각 모달마다 독립적인 backdrop */}
              <div className={styles.backdrop} />
              
              {/* Modal Content */}
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                {modal.content}
              </div>
            </div>,
            document.body
          )
        )}
    </ModalContext.Provider>
  );
}

