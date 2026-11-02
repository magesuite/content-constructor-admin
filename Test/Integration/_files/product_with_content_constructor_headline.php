<?php

declare(strict_types=1);

try {
    \Magento\TestFramework\Workaround\Override\Fixture\Resolver::getInstance()->requireDataFixture('Magento/Catalog/_files/products.php');
} catch (\Exception $e) {} //phpcs:ignore

/** @var $objectManager \Magento\TestFramework\ObjectManager */
$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

/** @var \Magento\Catalog\Api\ProductRepositoryInterface $productRepository */
$productRepository = $objectManager->get(\Magento\Catalog\Api\ProductRepositoryInterface::class);

/** @var \Magesuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent $headlineComponent */
$headlineComponent = $objectManager->create(\MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent::class);

/** @var \Magento\Catalog\Api\Data\ProductInterface $category */
$product =  $productRepository->get('simple');

$product->setData(\MageSuite\ContentConstructorAdmin\Setup\Patch\Data\AddContentConstructorContentAttribute::ATTRIBUTE_CODE, '');
$product = $headlineComponent->setEntity($product)
    ->setComponentId((string)time())
    ->setHeadline('headline')
    ->setSubheadline('subheadline')
    ->addHeaderComponentToEntity();
$product->getResource()->saveAttribute($product, \MageSuite\ContentConstructorAdmin\Setup\Patch\Data\AddContentConstructorContentAttribute::ATTRIBUTE_CODE);

$product = $productRepository->get('simple', true, 1, true);
$product = $headlineComponent->setEntity($product)
    ->setComponentId((string)time())
    ->setHeadline('headline2')
    ->setSubheadline('subheadline2')
    ->addHeaderComponentToEntity();
$productRepository->save($product);
