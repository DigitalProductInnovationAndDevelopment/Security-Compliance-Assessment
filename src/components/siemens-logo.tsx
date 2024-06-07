import Image from 'next/image'
import Siemens from '../../public/siemens-logo.png'


export default function SiemensLogo({ width = 500, height = 500 }) {
	return (
		<Image src={Siemens} height={height} width={width} alt='Siemens Logo' />
	)
}
