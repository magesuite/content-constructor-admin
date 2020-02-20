<?php

for ($i = 1; $i <= 3; $i++) {
    $category = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(\Magento\Catalog\Model\Category::class);
    $category->isObjectNew(true);
    $category->setId($i)
        ->setCreatedAt('2014-06-23 09:50:07')
        ->setName("Category {$i}")
        ->setParentId(2)
        ->setPath("1/2/{$i}")
        ->setLevel(2)
        ->setAvailableSortBy(['position', 'name'])
        ->setDefaultSortBy('name')
        ->setIsActive(true)
        ->setPosition(1)
        ->save();
}
