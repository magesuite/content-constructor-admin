<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Service;

class RemoveContentConstructorStoreData
{
    public const LAYOUT_UPDATE_XML_ATTRIBUTE_NAME = 'layout_update_xml';

    protected \Magento\Eav\Api\AttributeRepositoryInterface $attributeRepository;
    protected \MageSuite\ContentConstructorAdmin\Model\ResourceModel\ContentConstructorAttribute $contentConstructorAttributeResourceModel;
    protected \Psr\Log\LoggerInterface $logger;

    public function __construct(
        \Magento\Eav\Api\AttributeRepositoryInterface $attributeRepository,
        \MageSuite\ContentConstructorAdmin\Model\ResourceModel\ContentConstructorAttribute $contentConstructorAttributeResourceModel,
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->attributeRepository = $attributeRepository;
        $this->contentConstructorAttributeResourceModel = $contentConstructorAttributeResourceModel;
        $this->logger = $logger;
    }

    public function execute(string $entityType, object $model): void
    {
        try {
            if (!$model instanceof \Magento\Framework\Model\AbstractModel) {
                return;
            }

            /** @var \Magento\Eav\Api\Data\AttributeInterface $contentConstructorAttribute */
            $contentConstructorAttribute = $this->attributeRepository->get(
                $entityType,
                $this->getAttributeCode($model)
            );

            $this->contentConstructorAttributeResourceModel->removeStoreData(
                (int)$model->getStoreId(),
                $contentConstructorAttribute,
                $model
            );
        } catch (\Exception $e) {
            $this->logger->debug(
                __(
                    'Content constructor store data for entity_id = %1 and entity type: %2 has been not removed due to: %3',
                    $model->getId(),
                    $entityType,
                    $e->getMessage()
                )
            );
        }
    }

    protected function getAttributeCode(object $model): string
    {
        if ($model instanceof \MageSuite\BrandManagement\Api\Data\BrandsInterface) {
            return self::LAYOUT_UPDATE_XML_ATTRIBUTE_NAME;
        }

        return \MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME;
    }
}
