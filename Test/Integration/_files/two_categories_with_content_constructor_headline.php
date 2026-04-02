<?php

declare(strict_types=1);

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

/** @var \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository */
$categoryRepository = $objectManager->get(\Magento\Catalog\Api\CategoryRepositoryInterface::class);

/** @var \MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent $headlineComponent */
$headlineComponent = $objectManager->create(\MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent::class);

/** @var \Magento\Framework\App\RequestInterface $request */
$request = $objectManager->get(\Magento\Framework\App\RequestInterface::class);
$request->setPostValue([]);

$categoryFirst = $objectManager->create(\Magento\Catalog\Model\Category::class);
$categoryFirst->isObjectNew(true);
$categoryFirst->setId(333)
    ->setName('Category 1')
    ->setParentId(2)
    ->setPath('1/2/333')
    ->setLevel(2)
    ->setAvailableSortBy(['position', 'name'])
    ->setDefaultSortBy('name')
    ->setIsActive(true)
    ->setPosition(1)
    ->save();

$categorySecond = $objectManager->create(\Magento\Catalog\Model\Category::class);
$categorySecond->isObjectNew(true);
$categorySecond->setId(334)
    ->setName('Category 2')
    ->setParentId(2)
    ->setPath('1/2/334')
    ->setLevel(2)
    ->setAvailableSortBy(['position', 'name'])
    ->setDefaultSortBy('name')
    ->setIsActive(true)
    ->setPosition(2)
    ->save();

$categoryFirst = $categoryRepository->get(333);
$categoryFirst->setData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME, '');
$categoryFirst = $headlineComponent->setEntity($categoryFirst)
    ->setComponentId((string)time())
    ->setHeadline('headline_first_default')
    ->setSubheadline('subheadline_first_default')
    ->addHeaderComponentToEntity();
$categoryFirst->getResource()->saveAttribute($categoryFirst, \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

$categoryFirstStore = $categoryRepository->get(333, 1);
$categoryFirstStore = $headlineComponent->setEntity($categoryFirstStore)
    ->setComponentId((string)time())
    ->setHeadline('headline_first_store')
    ->setSubheadline('subheadline_first_store')
    ->addHeaderComponentToEntity();
$categoryFirstStore->setStoreId(1);
$categoryRepository->save($categoryFirstStore);

$categorySecond = $categoryRepository->get(334);
$categorySecond->setData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME, '');
$categorySecond = $headlineComponent->setEntity($categorySecond)
    ->setComponentId((string)time())
    ->setHeadline('headline_second_default')
    ->setSubheadline('subheadline_second_default')
    ->addHeaderComponentToEntity();
$categorySecond->getResource()->saveAttribute($categorySecond, \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

$categorySecondStore = $categoryRepository->get(334, 1);
$categorySecondStore = $headlineComponent->setEntity($categorySecondStore)
    ->setComponentId((string)time())
    ->setHeadline('headline_second_store')
    ->setSubheadline('subheadline_second_store')
    ->addHeaderComponentToEntity();
$categorySecondStore->setStoreId(1);
$categoryRepository->save($categorySecondStore);
