const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const upload = multer({ dest: 'tmp/' })

app.post('/upload', upload.single('model'), (req, res) => {
  if(!req.file) return res.status(400).send('No file')
  const modelsDir = path.join(__dirname, '..', 'public', 'models')
  if(!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true })
  const orig = req.file.path
  const dest = path.join(modelsDir, req.file.originalname)
  fs.rename(orig, dest, (err)=>{
    if(err) return res.status(500).send('Move error')
    res.send({ ok: true, path: `/models/${req.file.originalname}` })
  })
})

app.use(express.static(path.join(__dirname, '..', 'public')))

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log(`Upload server running at http://localhost:${port}`))
