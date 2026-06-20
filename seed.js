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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_01.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wMS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4NTcxLCJleHAiOjE4MTM1MTQ1NzF9.dUmz_5NBsu2Xd3pgKO9q30PsxM5pDREqztvAb1h3rkM'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_02.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wMi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4NzM2LCJleHAiOjE4MTM1MTQ3MzZ9.NP32CJJ93Pgi6LvstBcyUyPI2Ts9ig0E8t9NRGjW9MY'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_03.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wMy5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTgwNTA5LCJleHAiOjE4MTM1MTY1MDl9.nGeJey9c80KY3r7_eHFTM4_3jKD5OZlKCsoF7AJV5YM'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_04.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wNC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4NzUxLCJleHAiOjE4MTM1MTQ3NTF9.nIths1IJNq8I_tu1XADbUlmJlXT6ee7iNG5pBQm4GUI'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_05.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wNS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4NzcwLCJleHAiOjE4MTM1MTQ3NzB9.QdMcFpdkQWSIrM_O5bV7hbqi6_3GVtcNEkGdwvxP6_A'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_06.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wNi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4NzgzLCJleHAiOjE4MTM1MTQ3ODN9.E5KVhpwtTX6QL03ZLpMDjJk6jIgHjG_cDawCmC8Vmzk'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_07.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wNy5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4NzkzLCJleHAiOjE4MTM1MTQ3OTN9.HF8UChQ2ZK9VdtqUxjazba1iXja3uHIJcTVgMp7GBLA'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_08.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wOC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4ODA0LCJleHAiOjE4MTM1MTQ4MDR9.GgqP-Y0F5eqD_dvRKPsoWBKqtpHBOQf5Dl0nu_l6KCM'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_09.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18wOS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4ODE0LCJleHAiOjE4MTM1MTQ4MTR9.zmQSCq0uYkHk1n_wLcgdTikgb7M6HVYMgzxsaRuXNR0'
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
    image_url: 'https://nnerxfrbhuycktguvoza.supabase.co/storage/v1/object/sign/img_productos/img_10.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTAyYmViYy0zZjhkLTQwZjEtYmJmNy0yZDAxMjExMmM4OTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWdfcHJvZHVjdG9zL2ltZ18xMC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxOTc4ODI1LCJleHAiOjE4MTM1MTQ4MjV9.I12inCYUe85d3HBoB_WFDWX-iscilXneAKIsb2xyyz8'
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
