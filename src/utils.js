//////////////////////////////////////////////
// 線形補完
//////////////////////////////////////////////

const lerp = (x, y, p) => {
  return x + (y - x) * p
}

//////////////////////////////////////////////
// シャドーイング
//////////////////////////////////////////////

function setObjectsShadow(objs, castShadow, receiveShadow) {
  for (const obj of objs) {
    obj.castShadow = castShadow
    obj.receiveShadow = receiveShadow
  }
}

//////////////////////////////////////////////
// _particlesPosition
//////////////////////////////////////////////_particlesPosition

const numParticles = 500_000 // パーティクルの数
function _particlesPosition(bufferGeometry) {
  const material = new THREE.MeshBasicMaterial()
  const mesh = new THREE.Mesh(bufferGeometry.toNonIndexed(), material)
  const sampler = new THREE.MeshSurfaceSampler(mesh).build()
  const particlesPosition = new Float32Array(numParticles * 3)
  for (let i = 0; i < numParticles; i++) {
    const newPosition = new THREE.Vector3()
    const normal = new THREE.Vector3()

    sampler.sample(newPosition, normal)
    particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3)
  }
  console.log(particlesPosition)

  return particlesPosition
}

//////////////////////////////////////////////
// _particlesPositionForNumber
//////////////////////////////////////////////

// Float32Array
// 24-09-05_名前変更　_particlesPosition
function _particlesPositionForNumber(bufferGeometry, positionsNum) {
  const material = new THREE.MeshBasicMaterial()
  const mesh = new THREE.Mesh(bufferGeometry.toNonIndexed(), material)
  const sampler = new THREE.MeshSurfaceSampler(mesh).build()
  const particlesPosition = new Float32Array(positionsNum * 3)
  for (let i = 0; i < positionsNum; i++) {
    const newPosition = new THREE.Vector3()
    const normal = new THREE.Vector3()
    sampler.sample(newPosition, normal)
    particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3)
  }
  return particlesPosition
}

//////////////////////////////////////////////
// 直交するベクトル
//////////////////////////////////////////////

function _perpendicularVector(v1) {
  // 3次元ベクトル v1
  // const v1 = new THREE.Vector3(1, 2, 3);

  // v1と平行でない任意のベクトル v2 を選択
  // 例えば、z軸方向の単位ベクトル
  // const v2 = new THREE.Vector3(v1.x + 10, v1.y, v1.z);
  const v2 = new THREE.Vector3(0, 0, 1)

  // v1 と v2 の外積を計算
  const perpendicularVector = new THREE.Vector3()
  perpendicularVector.crossVectors(v1, v2)

  // console.log('直交ベクトル');
  // console.log(perpendicularVector);
  return perpendicularVector
}

//////////////////////////////////////////////
// ガウス分布
//////////////////////////////////////////////

function generateTexture_Gaussian() {
  const canvas = generateCanvas_Gaussian()
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

function generateCanvas_Gaussian() {
  //canvas要素の生成
  var canvas = document.createElement("canvas")
  //canvas要素のサイズ
  canvas.width = 256 //横幅
  canvas.height = 256 //縦幅
  //コンテキストの取得
  var context = canvas.getContext("2d")

  //ガウス分布の平均値と分散
  var x_ = canvas.width / 2 //平均値（x座標）
  var y_ = canvas.height / 2 //平均値（y座標）
  var sigma2 = 5000 //分散
  //ビットマップデータのRGBAデータ格納配列
  var bitmapData = []
  //RGBAデータ格納配列への値の代入
  for (var j = 0; j < canvas.height; j++) {
    for (var i = 0; i < canvas.width; i++) {
      var index = (j * canvas.width + i) * 4 //各ピクセルの先頭を与えるインデクス番号
      var x = i,
        y = j
      //ガウス分布の値の取得
      var f = Math.exp(
        -((x - x_) * (x - x_) + (y - y_) * (y - y_)) / (2 * sigma2),
      )
      //ビットマップデータのRGBAデータ
      bitmapData[index + 0] = 255 * f //R値
      bitmapData[index + 1] = 255 * f //R値
      bitmapData[index + 2] = 255 * f //R値
      bitmapData[index + 3] = 255 //A値
    }
  }
  //イメージデータオブジェクトの生成
  var imageData = context.createImageData(canvas.width, canvas.height)
  for (var i = 0; i < canvas.width * canvas.height * 4; i++) {
    imageData.data[i] = bitmapData[i] //配列のコピー
  }
  //return imageData;

  //イメージデータオブジェクトからcanvasに描画する
  context.putImageData(imageData, 0, 0)
  return canvas
}

//////////////////////////////////////////////
// 中心から外に行くほど法線ベクトルを寝せている (z成分を小さくする)
//////////////////////////////////////////////

function generateCanvas_length() {
  const canvas = document.createElement("canvas")

  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext("2d")

  const x_ = canvas.width / 2
  const y_ = canvas.height / 2
  // const R = canvas.height / 3;

  // 法線マップの場合
  const bitmapData = []
  for (let j = 0; j < canvas.height; j++) {
    for (let i = 0; i < canvas.width; i++) {
      const index = (j * canvas.width + i) * 4 // RGBA分
      const x = i
      const y = j
      const r = Math.sqrt((x - x_) * (x - x_) + (y - y_) * (y - y_)) // √(x*x) = (y*y)

      const v = 256 - (r / (canvas.width / 2)) * 256

      bitmapData[index + 0] = v
      bitmapData[index + 1] = v
      bitmapData[index + 2] = v
      bitmapData[index + 3] = 255

      // bitmapData[index + 0] = 127 + (128 * (x - x_)) / R; //R値
      // bitmapData[index + 1] = 127 + (128 * (y - y_)) / R; //G値
      // bitmapData[index + 2] = 127 + (128 * (R - r)) / R; //B値
      // bitmapData[index + 3] = 255; //A値
    }
  }

  const imageData = context.createImageData(canvas.width, canvas.height)

  for (let i = 0; i < canvas.width * canvas.height * 4; i++) {
    imageData.data[i] = bitmapData[i]
  }

  context.putImageData(imageData, 0, 0) // 0,0 は描画位置
  return canvas
}

//////////////////////////////////////////////
// 数学
//////////////////////////////////////////////
//　点(x1, y1, z1) を回転した点
function _rotationPos(x1, y1, z1, azimuth, elevation) {
  // 方位角 azimuth angle（度）、　仰角 elevation angle（度）
  const theta = azimuth * (Math.PI / 180) // 方位角
  const alpha = elevation * (Math.PI / 180) // 仰角
  const x =
    (x1 * Math.cos(theta) - y1 * Math.sin(theta)) * Math.cos(alpha) +
    z1 * Math.sin(alpha)
  const y = x1 * Math.sin(theta) + y1 * Math.cos(theta)
  const z =
    -(x1 * Math.cos(theta) - y1 * Math.sin(theta)) * Math.sin(alpha) +
    z1 * Math.cos(alpha)
  return new THREE.Vector3(x, y, z)
}
