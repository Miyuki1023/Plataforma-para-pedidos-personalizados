<script setup lang="ts">
import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Leaf,
  Heart,
  Truck,
  ArrowLeft,
  ArrowRight,
  Book,
  Instagram,
  Facebook,
  Music,
  Star,
  Settings,
  Bell,
  BellOff,
  Lock,
  ChevronRight,
  Mail,
  ShieldCheck

} from 'lucide-vue-next'

const icons = {
  menu: Menu,
  search: Search,
  user: User,
  cart: ShoppingCart,
  leaf: Leaf,
  heart: Heart,
  truck: Truck,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  book: Book,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
  star: Star,
  settings: Settings,
  bell: Bell,
  'bell-off': BellOff,
  lock: Lock,
  'chevron-right': ChevronRight,
  mail: Mail,
  'shield-check': ShieldCheck,
}

type IconName = keyof typeof icons

defineProps<{
  name: IconName
  size?: number
}>()
</script>

<template>
  <component
    :is="icons[name]"
    :size="size || 20"
    stroke-width="1.8"
  />
</template>