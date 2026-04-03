<?php

declare(strict_types=1);

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

/** @var \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository */
$categoryRepository = $objectManager->get(\Magento\Catalog\Api\CategoryRepositoryInterface::class);

/** @var \Magento\Catalog\Model\CategoryFactory $categoryFactory */
$categoryFactory = $objectManager->get(\Magento\Catalog\Model\CategoryFactory::class);

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

$categoryFirstDefault = $categoryFactory->create()->setStoreId(0)->load(333);
$categoryFirstDefault->setData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME, '');
$categoryFirstDefault = $headlineComponent->setEntity($categoryFirstDefault)
    ->setComponentId((string)time())
    ->setHeadline('headline_first_default')
    ->setSubheadline('subheadline_first_default')
    ->addHeaderComponentToEntity();
$categoryFirstDefault->getResource()->saveAttribute($categoryFirstDefault, \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

$categoryFirstStore = $categoryFactory->create()->setStoreId(1)->load(333);
$categoryFirstStore = $headlineComponent->setEntity($categoryFirstStore)
    ->setComponentId((string)time())
    ->setHeadline('headline_first_store')
    ->setSubheadline('subheadline_first_store')
    ->addHeaderComponentToEntity();
$categoryFirstStore->getResource()->saveAttribute($categoryFirstStore, \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

$categorySecondDefault = $categoryFactory->create()->setStoreId(0)->load(334);
$categorySecondDefault->setData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME, '');
$categorySecondDefault = $headlineComponent->setEntity($categorySecondDefault)
    ->setComponentId((string)time())
    ->setHeadline('headline_second_default')
    ->setSubheadline('subheadline_second_default')
    ->addHeaderComponentToEntity();
$categorySecondDefault->getResource()->saveAttribute($categorySecondDefault, \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

$categorySecondStore = $categoryFactory->create()->setStoreId(1)->load(334);
$categorySecondStore = $headlineComponent->setEntity($categorySecondStore)
    ->setComponentId((string)time())
    ->setHeadline('headline_second_store')
    ->setSubheadline('subheadline_second_store')
    ->addHeaderComponentToEntity();
$categorySecondStore->getResource()->saveAttribute($categorySecondStore, \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);
