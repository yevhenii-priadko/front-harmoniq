import Spinner from '@/components/Spinner/Spinner'
import css from './loading.module.css'

export default function Loading() {
return (
<div className={css.wrapper}>
<Spinner size={80} ariaLabel="oval-loading" />
</div>
);
}