<?php

declare(strict_types=1);

try {
    \Magento\TestFramework\Workaround\Override\Fixture\Resolver::getInstance()->requireDataFixture('Magento/Catalog/_files/category.php');
} catch (\Exception $e) {} //phpcs:ignore

/** @var $objectManager \Magento\TestFramework\ObjectManager */
$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

/** @var \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository */
$categoryRepository = $objectManager->get(\Magento\Catalog\Api\CategoryRepositoryInterface::class);

/** @var \Magesuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent $headlineComponent */
$headlineComponent = $objectManager->create(\MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent::class);

/** @var \Magento\Catalog\Api\Data\CategoryInterface $category */
$category =  $categoryRepository->get(333);

$category->setData(\MageSuite\ContentConstructorAdmin\Setup\Patch\Data\AddContentConstructorContentAttribute::ATTRIBUTE_CODE, '');
$category = $headlineComponent->setEntity($category)
    ->setComponentId((string)time())
    ->setHeadline('headline')
    ->setSubheadline('subheadline')
    ->addHeaderComponentToEntity();
$category->getResource()->saveAttribute($category, \MageSuite\ContentConstructorAdmin\Setup\Patch\Data\AddContentConstructorContentAttribute::ATTRIBUTE_CODE);

$category = $categoryRepository->get(333, 1);
$category = $headlineComponent->setEntity($category)
    ->setComponentId((string)time())
    ->setHeadline('headline2')
    ->setSubheadline('subheadline2')
    ->addHeaderComponentToEntity();
$categoryRepository->save($category);
