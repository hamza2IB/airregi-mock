import {
  IoSearchOutline,
  IoCartOutline,
  IoPersonOutline,
  IoPersonAddOutline,
  IoCloseOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkCircle,
  IoCheckmarkOutline,
  IoPauseCircleOutline,
  IoPlayOutline,
  IoStar,
  IoWalletOutline,
  IoReceiptOutline,
  IoLockClosedOutline,
  IoHelpCircleOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoAddCircleOutline,
  IoPrintOutline,
  IoStorefront,
  IoCardOutline,
  IoCashOutline,
  IoQrCodeOutline,
  IoPricetagOutline,
  IoArrowBackOutline,
  IoGiftOutline,
  IoAlertCircleOutline,
  IoShieldCheckmarkOutline,
  IoCloudDoneOutline,
} from 'react-icons/io5'

// Maps the original ionicon names used in the mock markup to react-icons/io5.
const ICONS = {
  'search-outline': IoSearchOutline,
  'cart-outline': IoCartOutline,
  'person-outline': IoPersonOutline,
  'person-add-outline': IoPersonAddOutline,
  'close-outline': IoCloseOutline,
  'trash-outline': IoTrashOutline,
  'checkmark-circle-outline': IoCheckmarkCircleOutline,
  'checkmark-circle': IoCheckmarkCircle,
  'checkmark-outline': IoCheckmarkOutline,
  'pause-circle-outline': IoPauseCircleOutline,
  'play-outline': IoPlayOutline,
  star: IoStar,
  'wallet-outline': IoWalletOutline,
  'receipt-outline': IoReceiptOutline,
  'lock-closed-outline': IoLockClosedOutline,
  'help-circle-outline': IoHelpCircleOutline,
  'log-in-outline': IoLogInOutline,
  'log-out-outline': IoLogOutOutline,
  'add-circle-outline': IoAddCircleOutline,
  'print-outline': IoPrintOutline,
  storefront: IoStorefront,
  'card-outline': IoCardOutline,
  'cash-outline': IoCashOutline,
  'qr-code-outline': IoQrCodeOutline,
  'pricetag-outline': IoPricetagOutline,
  'arrow-back-outline': IoArrowBackOutline,
  'gift-outline': IoGiftOutline,
  'alert-circle-outline': IoAlertCircleOutline,
  'shield-checkmark-outline': IoShieldCheckmarkOutline,
  'cloud-done-outline': IoCloudDoneOutline,
}

/**
 * Renders an icon from react-icons/io5 by its original ionicon name.
 * Sized in `em`, so `size` (px) or a Tailwind text-* class controls dimensions.
 */
export default function Icon({ name, size, className = '', style = {}, ...rest }) {
  const Cmp = ICONS[name]
  if (!Cmp) {
    if (import.meta.env.DEV) console.warn(`Icon: unknown name "${name}"`)
    return null
  }
  const mergedStyle = size ? { fontSize: `${size}px`, ...style } : style
  return <Cmp className={className} style={mergedStyle} {...rest} />
}
