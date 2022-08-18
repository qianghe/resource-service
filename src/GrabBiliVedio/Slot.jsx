import React from 'react';
import { Input, Typography, Button } from 'antd';
import { HighlightOutlined, DeploymentUnitOutlined } from '@ant-design/icons'
import './index.scss';

const { Title, Paragraph } = Typography;

export const Describer = (
  <>
    <Title level={3}>GrabBiliVedioService</Title>
    <Paragraph>
      You can type title/url of veido on Bilibili, 
      help you fetch the resource.
    </Paragraph>
  </>
)

export const EasyForm = (props) => (
  <div className="form">
    <Input
      placeholder="Enter title"
      prefix={<HighlightOutlined />}
      value={props.title}
      onChange={(e) => props.handleChange(e, 'title')}
    />
    <Input
      placeholder="Enter URL"
      prefix={<DeploymentUnitOutlined />}
      value={props.url}
      onChange={(e) => props.handleChange(e, 'url')}
    />
    <Button
      type="dashed"
      block
      disabled={!props.url}
      onClick={props.handleClick}
      loading={props.loading}
    >
      Grab!
    </Button>
  </div>
)