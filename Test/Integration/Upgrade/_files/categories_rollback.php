<?php

$categoriesIds = [101, 102, 103];

foreach($categoriesIds as $categoryId){
    /** @var \Magento\Catalog\Model\Category $category */
    $category = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create('Magento\Catalog\Model\Category');
    $category->load($categoryId);

    if ($category->getId()) {
        $category->delete();
    }
}
