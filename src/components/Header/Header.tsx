import Image from "next/image";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <Image
            src="/flyquest-logo.svg"
            alt="Quantergy logo"
            width={24}
            height={24}
            className={styles.logoImage}
            priority
          />
        </div>
        <span className={styles.logo}>Quantergy</span>
      </div>
    </header>
  );
}
