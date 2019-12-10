import React, { useState, useEffect } from 'react';
import { IUiApi } from 'umi-types';
import { Select, Card, List, Avatar, Button, message, notification } from 'antd';

export interface IMouleItemProp {
  url: string;
  tags: string[];
  title: string;
  curTag: string;
}

export default (api: IUiApi) => {
  const { callRemote } = api;

  function PluginPanel() {
    const [repositorys, setRepositorys] = useState([]);

    // 查询仓库列表
    useEffect(() => {
      const fetchRepositorys = async () => {
        const result: any = await callRemote({
          type: 'org.xiexingen.wetrial-plugin.modules',
        });
        setRepositorys(result.repositorys);
      };
      fetchRepositorys();
    }, []);

    // 点击更新代码操作
    const handleUpdateCode = async (index: number) => {
      const curModule = repositorys[index];
      const result: any = await callRemote({
        type: 'org.xiexingen.wetrial-plugin.updateCode',
        payload: {
          url: curModule.url,
          tag: curModule.curTag,
        },
      });
      if (result.success) {
        message.success('更新成功！');
      } else {
        notification.error({
          message: '更新失败',
          description: result.description,
        });
      }
    };

    // 选择不同的tag
    const handleChangeTag = (index: number, v: string) => {
      repositorys[index].curTag = v;
      setRepositorys([...repositorys]);
    };

    return (
      <Card>
        <List
          bordered
          dataSource={repositorys}
          renderItem={(item: IMouleItemProp, index) => (
            <List.Item key={item.url}>
              <List.Item.Meta
                avatar={
                  <Avatar size={64} style={{ color: '#f56a00', backgroundColor: '#fff' }}>
                    {item.title}
                  </Avatar>
                }
                title={`${item.title}:${item.url}`}
                description={
                  <Select
                    onChange={handleChangeTag.bind(this, index)}
                    value={item.curTag}
                    style={{ width: 100 }}
                    placeholder="请选择版本号"
                  >
                    {item.tags.map(tag => (
                      <Select.Option value={tag}>{tag}</Select.Option>
                    ))}
                  </Select>
                }
              />
              <div>
                <Button onClick={handleUpdateCode.bind(this, index)} type="primary">
                  更新代码
                </Button>
              </div>
            </List.Item>
          )}
        />
      </Card>
    );
  }

  api.addPanel({
    title: 'wetrial',
    path: '/wetrial-plugin',
    icon: 'api',
    component: PluginPanel,
  });
};
