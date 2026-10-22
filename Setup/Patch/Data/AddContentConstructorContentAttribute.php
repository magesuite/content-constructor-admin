<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Setup\Patch\Data;

class AddContentConstructorContentAttribute implements \Magento\Framework\Setup\Patch\DataPatchInterface
{
    public const ATTRIBUTE_CODE = 'content_constructor_content';

    protected const ENTITY_TYPES = [
        \Magento\Catalog\Model\Product::ENTITY,
        \Magento\Catalog\Model\Category::ENTITY,
    ];

    public function __construct(
        protected \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup,
        protected \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory
    ) {
    }

    public function apply(): self
    {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);

        foreach (self::ENTITY_TYPES as $entityType) {
            $this->addAttributeIfMissing($eavSetup, $entityType);
        }

        return $this;
    }

    public static function getDependencies(): array
    {
        return [];
    }

    public function getAliases(): array
    {
        return [];
    }

    protected function addAttributeIfMissing(\Magento\Eav\Setup\EavSetup $eavSetup, string $entityType): void
    {
        if ($eavSetup->getAttribute($entityType, self::ATTRIBUTE_CODE)) {
            return;
        }

        $eavSetup->addAttribute(
            $entityType,
            self::ATTRIBUTE_CODE,
            [
                'type' => 'text',
                'label' => 'Content Constructor Content',
                'input' => 'text',
                'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                'visible' => 0,
                'required' => 0,
            ]
        );
    }
}
