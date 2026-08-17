import { Oval } from 'react-loader-spinner'
import css from './loading.module.css'

export default function Loading() {
return (
<Oval
height={80}
width={80}
color="var(--green)"
wrapperStyle={{}}
wrapperClass={css.wrapper}
visible={true}
ariaLabel="oval-loading"
secondaryColor="#D1E0D8"
strokeWidth={2}
strokeWidthSecondary={2}
/>
);
}