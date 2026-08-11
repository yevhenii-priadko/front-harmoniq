import UploadForm from "@/components/UploadForm/UploadForm";
import styles from "./PhotoPage.module.css";

export default function PhotoPage() {
  return (
    <section className={styles.page} aria-label="Upload profile photo">
      <UploadForm />
    </section>
  );
}
