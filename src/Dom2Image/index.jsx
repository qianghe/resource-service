import React, { useState, useRef, useCallback } from 'react';
import { Typography } from 'antd';
import { StarFilled, ForkOutlined } from '@ant-design/icons';
import Dom2ImageClass from './dom2Image'
import { download } from './util'
import styles from './index.module.scss'

const { Title, Paragraph } = Typography
const dom2Image = new Dom2ImageClass()
const outlineClassName = styles.outline

function Dom2Image() {
  const [imgSrc, setImgSrc] = useState('')
  const ref = useRef(null)
  
  function handleMouseOver(event) {
    event.target.classList.add(outlineClassName)
  }
  function handleMouseOut(event) {
    event.target.classList.remove(outlineClassName)
  }
  const handleClick = useCallback(async (event) => {
    const dom = event.target
    dom.classList.remove(outlineClassName)

    const imgUrl = await dom2Image.toSvg(dom)
    // preview image
    setImgSrc(imgUrl)
    // download the image
    download(imgUrl, 'svg')
  }, [])

  return (
   <div className={styles['d2i-outer']}>
     <Typography
      className={styles.d2i}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClick}
      ref={ref}
    >
      <Title level={3} className={styles['d2i-title']}>
        <span>TheAlgorithms</span>
        <span> / </span>
        <span>JavaScript</span>
      </Title>
      <Paragraph italic className={styles['d2i-desc']}>
        Algorithms and Data Structures implemented in JavaScript for beginners, following best practices.
      </Paragraph>
      <div className={styles['d2i-meta']}>
        <span className={styles.star}>
          <StarFilled />
          <span> 2W+</span>
        </span>
        <span className={styles.fork}>
          <ForkOutlined />
          <span> 3K+</span>
        </span>
        <span className={styles.lang}>
          <i className={styles['lang-icon']} />
          <span>JavaScript</span>
        </span>
      </div>
    </Typography>
    {
      imgSrc ? (
        <div>
          <p>----Preview-----</p>
          <img src={imgSrc} alt="" />
        </div>
      ) : ''
    }
   </div>
  );
}

export default Dom2Image;
