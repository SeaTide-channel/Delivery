-- 插入分类数据
INSERT INTO category (name, sort_order, merchant_id) VALUES
('主食', 1, 1),
('小吃', 2, 1),
('饮料', 3, 1);

-- 插入菜品数据
INSERT INTO dish (category_id, name, sort_order, price, image_url, status, description, merchant_id) VALUES
(1, '红烧肉', 1, 38.0, 'https://picsum.photos/seed/hongshaorou/400/400', 'ON_SALE', '经典红烧肉，肥而不腻', 1),
(1, '宫保鸡丁', 2, 28.0, 'https://picsum.photos/seed/gongbao/400/400', 'ON_SALE', '传统川菜，香辣可口', 1),
(1, '鱼香肉丝', 3, 25.0, 'https://picsum.photos/seed/yuxiang/400/400', 'ON_SALE', '酸甜可口，开胃下饭', 1),
(2, '炸薯条', 1, 15.0, 'https://picsum.photos/seed/shutiao/400/400', 'ON_SALE', '外酥里嫩，蘸番茄酱更佳', 1),
(2, '鸡米花', 2, 18.0, 'https://picsum.photos/seed/jimihua/400/400', 'ON_SALE', '香脆可口，老少皆宜', 1),
(3, '可乐', 1, 8.0, 'https://picsum.photos/seed/kele/400/400', 'ON_SALE', '冰镇可乐，消暑解渴', 1),
(3, '雪碧', 2, 8.0, 'https://picsum.photos/seed/xuebi/400/400', 'ON_SALE', '清爽雪碧，透心凉', 1),
(3, '矿泉水', 3, 5.0, 'https://picsum.photos/seed/kuangquanshui/400/400', 'ON_SALE', '纯净矿泉水', 1);
