<?php

declare(strict_types=1);

$registry = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->get(\Magento\Framework\Registry::class);
$registry->unregister('isSecureArea');
$registry->register('isSecureArea', true);

foreach ([333, 334] as $categoryId) {
    $category = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(\Magento\Catalog\Model\Category::class);
    $category->load($categoryId);
    if ($category->getId()) {
        $category->delete();
    }
}

$registry->unregister('isSecureArea');
$registry->register('isSecureArea', false);
