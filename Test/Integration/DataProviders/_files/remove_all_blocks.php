<?php

$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

$blocksCollection = $objectManager->create(\Magento\Cms\Model\ResourceModel\Block\Collection::class);
/** @var \Magento\Cms\Model\BlockRepository $blockRepository */
$blockRepository = $objectManager->create(\Magento\Cms\Model\BlockRepository::class);

/** @var \Magento\Cms\Model\Block $block */
foreach($blocksCollection->getItems() as $block) {
    $blockRepository->delete($block);
}