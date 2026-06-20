import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Leer archivo .env manualmente
const envPath = path.join(process.cwd(), '.env')
let supabaseUrl = ''
let supabaseKey = ''

try {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const lines = envContent.split('\n')
  for (const line of lines) {
    const parts = line.split('=')
    if (parts[0] === 'VITE_SUPABASE_URL') {
      supabaseUrl = parts[1].trim()
    } else if (parts[0] === 'VITE_SUPABASE_ANON_KEY') {
      supabaseKey = parts[1].trim()
    }
  }
} catch (e) {
  console.error('Error al leer el archivo .env:', e.message)
  process.exit(1)
}

if (!supabaseUrl || !supabaseKey) {
  console.error('No se encontraron las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const BASE_IMG = 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/public/img_productos'

const initialProducts = [
  {
    name: 'cable 3 en 1',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable de carga múltiple de alta calidad.',
    price: 30.00,
    buy_price: 15.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-01',
    image_url: `${BASE_IMG}/img_01.png?width=300&format=webp`
  },
  {
    name: 'cable de 2m(c a c)',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable tipo C a tipo C de 2 metros.',
    price: 30.00,
    buy_price: 22.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-02',
    image_url: `${BASE_IMG}/img_02.png?width=300&format=webp`
  },
  {
    name: 'cable xiomi con cubo',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable Xiaomi completo con cubo cargador.',
    price: 30.00,
    buy_price: 20.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-03',
    image_url: `${BASE_IMG}/img_03.png?width=300&format=webp`
  },
  {
    name: 'cable 2 en 1(c a lingning)',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable de carga rápida compatible con Lightning y Tipo C.',
    price: 30.00,
    buy_price: 18.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-04',
    image_url: `${BASE_IMG}/img_04.png?width=300&format=webp`
  },
  {
    name: 'cable naranja (c a c)',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable reforzado tipo C a tipo C en color naranja.',
    price: 40.00,
    buy_price: 20.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-05',
    image_url: `${BASE_IMG}/img_05.png?width=300&format=webp`
  },
  {
    name: 'cable negro trenzado (usb a c)',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable trenzado USB a tipo C de alta resistencia.',
    price: 20.00,
    buy_price: 13.00,
    initial_stock: 12,
    installments: 'Pago único',
    code: 'CAB-06',
    image_url: `${BASE_IMG}/img_06.png?width=300&format=webp`
  },
  {
    name: 'cable blancos de c a c',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable de carga color blanco tipo C a tipo C.',
    price: 20.00,
    buy_price: 13.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-07',
    image_url: `${BASE_IMG}/img_07.png?width=300&format=webp`
  },
  {
    name: 'cable (usb a ligning )',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable de carga USB a Lightning para Apple.',
    price: 20.00,
    buy_price: 13.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-08',
    image_url: `${BASE_IMG}/img_08.png?width=300&format=webp`
  },
  {
    name: 'Cable C a ligning',
    model: '',
    category: 'Cables y Audífonos',
    specs: 'Cable de carga rápida USB Tipo C a Lightning.',
    price: 40.00,
    buy_price: 25.00,
    initial_stock: 6,
    installments: 'Pago único',
    code: 'CAB-09',
    image_url: `${BASE_IMG}/img_09.png?width=300&format=webp`
  },
  {
    name: 'Parlante',
    model: '',
    category: 'Audio',
    specs: 'Parlante portátil de alta calidad de sonido.',
    price: 60.00,
    buy_price: 35.00,
    initial_stock: 4,
    installments: 'Pago único',
    code: 'PAR-10',
    image_url: `${BASE_IMG}/img_10.png?width=300&format=webp`
  }
]

async function seed() {
  console.log('Sembrando la base de datos de Supabase...')
  
  // Limpiar productos existentes opcionalmente
  console.log('Eliminando productos anteriores...')
  const { error: deleteError } = await supabase.from('productos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Error al limpiar base de datos. Asegúrate de haber corrido supabase-setup.sql:', deleteError.message)
    process.exit(1)
  }

  // Insertar nuevos
  const { data, error } = await supabase.from('productos').insert(initialProducts).select()
  
  if (error) {
    console.error('Error insertando productos:', error.message)
    process.exit(1)
  }

  console.log(`¡Éxito! Se insertaron ${data.length} productos correctamente en Supabase.`)
}

seed()
