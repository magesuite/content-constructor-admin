<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Setup\Patch\Data;

class UseDefaultComponentsAttribute implements \Magento\Framework\Setup\Patch\DataPatchInterface
{
    protected \Magento\Eav\Setup\EavSetup $eavSetup;

    public function __construct(
        \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory,
        \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup
    ) {
        $this->eavSetup = $eavSetupFactory->create(['setup' => $moduleDataSetup]);
    }

    /**
     * {@inheritdoc}
     */
    public function apply()
    {
        $this->eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'use_default_components',
            [
                'type' => 'int',
                'backend' => '',
                'label' => 'Use Default Value',
                'input' => 'checkbox',
                'source' => \Magento\Eav\Model\Entity\Attribute\Source\Boolean::class,
                'visible' => true,
                'required' => false,
                'default' => '0',
                'frontend' => '',
                'unique' => false,
                'note' => 'After checking the checkbox and saving the form, the store value will be removed.',
                'group' => 'Content Constructor'
            ]
        );
    }

    /**
     * {@inheritdoc}
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }
}
