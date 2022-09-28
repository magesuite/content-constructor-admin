<?php

declare(strict_types=1);

try {
    \Magento\TestFramework\Workaround\Override\Fixture\Resolver::getInstance()->requireDataFixture('MageSuite_BrandManagement::Test/Integration/_files/brands.php');
} catch (\Exception $e) {} //phpcs:ignore

/** @var $objectManager \Magento\TestFramework\ObjectManager */
$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

/** @var \Magesuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent $headlineComponent */
$headlineComponent = $objectManager->create(\MageSuite\ContentConstructorAdmin\Test\Integration\Fixtures\HeadlineComponent::class);

/** @var \MageSuite\BrandManagement\Model\BrandsRepository $brandsRepository */
$brandsRepository = $objectManager->create(\MageSuite\BrandManagement\Model\BrandsRepository::class);

$brand = $brandsRepository->getById(600, 0);
$brand->setLayoutUpdateXml('');
$brand = $headlineComponent->setEntity($brand)
    ->setComponentId((string)time())
    ->setHeadline('headline')
    ->setSubheadline('subheadline')
    ->addHeaderComponentToEntity();
$brand->getResource()->saveAttribute($brand, \MageSuite\ContentConstructorAdmin\Service\RemoveContentConstructorStoreData::LAYOUT_UPDATE_XML_ATTRIBUTE_NAME);

$brand = $brandsRepository->getById(600, 1);
$brand = $headlineComponent->setEntity($brand)
    ->setComponentId((string)time())
    ->setHeadline('headline2')
    ->setSubheadline('subheadline2')
    ->addHeaderComponentToEntity();
$brandsRepository->save($brand);
