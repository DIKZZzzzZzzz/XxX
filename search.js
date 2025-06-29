import axios from 'axios'
import cheerio from 'cheerio'

export default async function handler(req, res) {
  const { query } = req.query
  if (!query) return res.status(400).json({ status: false, message: 'Query kosong!' })

  try {
    const { data } = await axios.get(`https://www.xvideos.com/?k=${encodeURIComponent(query)}`)
    const $ = cheerio.load(data)
    const result = []

    $('.thumb-block').each((_, el) => {
      const title = $(el).find('.title a').text().trim()
      const url = 'https://www.xvideos.com' + $(el).find('.title a').attr('href')
      const thumb = $(el).find('img').attr('data-src') || $(el).find('img').attr('src')
      const duration = $(el).find('.duration').text().trim()
      const views = $(el).find('.metadata .views').text().trim()

      if (title && url && thumb) {
        result.push({ title, url, duration, views, thumb })
      }
    })

    res.json({ status: true, result })
  } catch (e) {
    res.status(500).json({ status: false, message: 'Gagal scraping' })
  }
}
