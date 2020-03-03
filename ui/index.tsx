/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { IUiApi } from 'umi-types';
import {
  Form,
  Tooltip,
  Select,
  Card,
  List,
  Avatar,
  Button,
  message,
  notification,
  Badge,
} from 'antd';
import { CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';

export interface IMouleItemProp {
  url: string;
  tags: string[];
  title: string;
  curTag: string;
}

export default (api: IUiApi) => {
  const { callRemote } = api;

  function PluginPanel() {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [repositorys, setRepositorys] = useState([]);
    const [installedPackages, setInstalledPackages] = useState({});
    const [form] = Form.useForm();
    // 查询仓库列表
    useEffect(() => {
      const fetchRepositorys = async () => {
        setLoading(true);
        const result: any = await callRemote({
          type: 'org.xiexingen.wetrial-plugin.packages',
        });
        setLoading(false);
        setRepositorys(result.packages);

        setInstalledPackages(result.installedPackages);
        form.setFieldsValue(result.installedPackages);
      };
      fetchRepositorys();
    }, []);

    // 点击更新代码操作
    const handleUpdateCode = async values => {
      // 获取选中的值
      const formValues = {};
      Object.keys(values).forEach(key => {
        if (values[key]) {
          formValues[key] = values[key];
        }
      });

      // 解析出要卸载的
      const needUnInstalls = [];
      Object.keys(installedPackages).forEach(key => {
        if (!formValues[key]) {
          needUnInstalls.push(key);
        }
      });

      const needInstalls = [];
      // 解析出要安装的(新增、更新)
      Object.keys(formValues).forEach(key => {
        // 之前安装包没有，或者版本不同
        if (!installedPackages[key]) {
          needInstalls.push({
            name: key,
            version: formValues[key],
          });
        } else if (installedPackages[key] !== formValues[key]) {
          needInstalls.push({
            name: key,
            version: formValues[key],
          });
        }
      });

      setSubmitting(true);
      const result: any = await callRemote({
        type: 'org.xiexingen.wetrial-plugin.updateCode',
        payload: {
          needInstalls,
          needUnInstalls,
        },
      });
      setSubmitting(false);
      if (result.success) {
        message.success('安装成功！');
      } else {
        notification.error({
          message: '安装失败',
          description: result.description,
        });
      }
    };

    return (
      <Form form={form} onFinish={handleUpdateCode}>
        <Card
          title="Wetrial 模块管理器"
          extra={
            <Button loading={submitting} htmlType="submit" type="primary">
              安装到本地
            </Button>
          }
        >
          <List
            loading={loading}
            bordered
            grid={{ gutter: 16, column: 4 }}
            dataSource={repositorys}
            renderItem={(item: IMouleItemProp) => {
              const isInstalled = Object.keys(installedPackages).includes(item.title);
              const curIsLastVersion =
                installedPackages[`${item.title}`] === `^${item.tags[item.tags.length - 1]}`;
              return (
                <List.Item key={item.title}>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={
                          isInstalled ? (
                            curIsLastVersion ? (
                              <Tooltip title="已经是最新的版本啦">
                                {' '}
                                <CheckOutlined style={{ color: 'green' }} />
                              </Tooltip>
                            ) : (
                              <Tooltip title="有更新的版本哦！">
                                <ClockCircleOutlined style={{ color: 'red' }} />
                              </Tooltip>
                            )
                          ) : (
                            0
                          )
                        }
                      >
                        <Avatar
                          size={64}
                          style={{
                            color: '#f56a00',
                            backgroundColor: isInstalled ? '#092b00' : '#fff',
                          }}
                        >
                          {item.title}
                        </Avatar>
                      </Badge>
                    }
                    title={`${item.title}`}
                    description={
                      <Form.Item name={`${item.title}`}>
                        <Select allowClear style={{ width: 160 }} placeholder="请选择版本号">
                          {item.tags.map(tag => (
                            <Select.Option value={`^${tag}`}>{tag}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </Form>
    );
  }

  api.addPanel({
    title: 'wetrial',
    path: '/wetrial-plugin',
    icon: 'api',
    component: PluginPanel,
  });
};
