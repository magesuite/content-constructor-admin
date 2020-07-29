<?php

namespace MageSuite\ContentConstructorAdmin\Setup\Patch\Data;

class GenerateSecretPreviewToken implements \Magento\Framework\Setup\Patch\DataPatchInterface
{
    /**
     * @var \Magento\Framework\Setup\ModuleDataSetupInterface
     */
    protected $moduleDataSetup;

    /**
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup
     */
    public function __construct(
        \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
    }

    /**
     * {@inheritdoc}
     */
    public function apply()
    {
        $configTable = $this->moduleDataSetup->getTable('core_config_data');
        $secretApplicationHash = hash("sha256", random_int(0, 10000000000) . time());

        $this->moduleDataSetup->getConnection()->insert(
            $configTable,
            [
                'value' => $secretApplicationHash,
                'path' => \MageSuite\ContentConstructorAdmin\Helper\Configuration::SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH
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
