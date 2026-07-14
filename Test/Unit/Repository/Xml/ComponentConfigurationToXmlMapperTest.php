<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Repository\Xml;

class ComponentConfigurationToXmlMapperTest extends \PHPUnit\Framework\TestCase
{
    protected array $componentsConfiguration = [
        [
            'type' => 'static-cms-block',
            'id' => 'first_random_generated_value',
            'section' => 'sidebar',
            'data' => [
                'identifier' => 'cms_static_block_identifier'
            ]
        ],
        [
            'type' => 'headline',
            'id' => 'second_random_generated_value',
            'section' => 'content',
            'data' => [
                'title' => 'Some Title',
                'subtitle' => 'Some Subtitle',
                'nested' => [
                    'key' => 'value'
                ]
            ]
        ],
    ];

    protected string $existingXml = '
        <referenceContainer name="sidebar">
              <block class="Something" name="some_value">
                   <arguments>
                        <argument name="random" xsi:type="string">string</argument>
                   </arguments>
              </block>
        </referenceContainer>
        <referenceContainer name="content">
           <referenceBlock name="page.main.title" remove="true"/>
              <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="first_random_generated_value">
              </block>
              <block class="ClientCustomClass" name="client_custom_class">
                <arguments>
                    <argument name="block_id" xsi:type="string">identifier</argument>
                </arguments>
              </block>
              <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="second_random_generated_value">
              </block>
           </referenceContainer>
        ';

    protected $firstComponentPosition;
    protected $secondComponentPosition;

    protected $xml;
    protected $dom;

    protected \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper();
    }

    public function testItLeavesExistingCustomBlocks(): void
    {
        $this->prepareTestData(true);

        $this->assertNotNull($this->getBlockByNumber(2, 'sidebar'));
        $this->assertNotNull($this->getBlockByNumber(2, 'content'));
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('typesProvider')]
    public function testItGeneratesProperBlockClass($withExistingXml): void
    {
        $this->prepareTestData($withExistingXml);

        $class = 'MageSuite\ContentConstructorFrontend\Block\Component';

        $this->assertEquals($class, $this->getBlockByNumber($this->firstComponentPosition, 'sidebar')['class']);
        $this->assertEquals($class, $this->getBlockByNumber($this->secondComponentPosition, 'content')['class']);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('typesProvider')]
    public function testItGeneratesProperComponentsNames($withExistingXml): void
    {
        $this->prepareTestData($withExistingXml);

        $this->assertEquals('first_random_generated_value',
            $this->getBlockByNumber($this->firstComponentPosition, 'sidebar')['name']);
        $this->assertEquals('second_random_generated_value',
            $this->getBlockByNumber($this->secondComponentPosition, 'content')['name']);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('typesProvider')]
    public function testItGeneratesProperComponentsData($withExistingXml): void
    {
        $this->prepareTestData($withExistingXml);

        $this->assertEquals('static-cms-block', $this->getArgumentValue($this->firstComponentPosition, 'sidebar', 'type'));
        $this->assertEquals('cms_static_block_identifier', $this->getArgumentValue($this->firstComponentPosition, 'sidebar', 'data/identifier'));

        $this->assertEquals('headline', $this->getArgumentValue($this->secondComponentPosition, 'content', 'type'));
        $this->assertEquals('Some Title', $this->getArgumentValue($this->secondComponentPosition, 'content', 'data/title'));
        $this->assertEquals('Some Subtitle', $this->getArgumentValue($this->secondComponentPosition, 'content', 'data/subtitle'));
        $this->assertEquals('value', $this->getArgumentValue($this->secondComponentPosition, 'content', 'data/nested/key'));
    }

    /**
     * @param $forbiddenString
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('getForbiddenStrings')]
    public function testXmlRootNodeDoesNotExists(string $forbiddenString): void
    {
        $assertNotContains = method_exists($this, 'assertStringNotContainsString') ? 'assertStringNotContainsString' : 'assertNotContains';

        $this->$assertNotContains($forbiddenString, strtolower($this->mapper->map($this->componentsConfiguration, $this->existingXml)));
        $this->$assertNotContains($forbiddenString, strtolower($this->mapper->map($this->componentsConfiguration)));
    }

    public function testWorksWithEmptyComponentsArray(): void
    {
        $rootXml = "\n\n";
        $expectedWith = "\n<referenceContainer name=\"sidebar\"/>\n";

        $this->assertEquals($rootXml, $this->mapper->map(null));
        $this->assertEquals($expectedWith, $this->mapper->map(null, '<referenceContainer name="sidebar"></referenceContainer>'));
    }

    public static function getForbiddenStrings(): array
    {
        return [
            ['<xml'],
            ['</xml>'],
        ];
    }

    private function getArgumentValue($blockNumber, $containerName, $argumentName)
    {
        $xpath = '//referenceContainer[@name="%s"]//block[%s]//arguments//%s//text()';;

        return $this->getValueByXpath(sprintf($xpath, $containerName, $blockNumber, $this->buildXpath($argumentName)));
    }


    public static function typesProvider(): array
    {
        return [[true], [false]];
    }

    /**
     * @return \DOMElement
     * @throws \Exception
     */
    private function getBlockByNumber($number, $containerName = 'content')
    {
        $xpath = sprintf('//referenceContainer[@name="%s"]//block[%s]', $containerName, $number);

        return $this->dom->xpath($xpath)[0];
    }

    private function prepareTestData($withExistingXml)
    {
        if ($withExistingXml) {
            $this->xml = $this->mapper->map($this->componentsConfiguration, $this->existingXml);
            $this->firstComponentPosition = 2;
            $this->secondComponentPosition = 2;
        } else {
            $this->xml = $this->mapper->map($this->componentsConfiguration);
            $this->firstComponentPosition = 1;
            $this->secondComponentPosition = 1;
        }

        $this->xml = '<?xml version="1.0"?><xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' . $this->xml . '</xml>';

        $this->dom = new \SimpleXMLElement($this->xml);
    }

    /**
     * @param $argumentName
     * @return string
     */
    private function buildXpath($argumentName)
    {
        $tree = explode('/', $argumentName);

        $first = array_shift($tree);
        $xpath = 'argument[@name="' . $first . '"]';

        foreach ($tree as $node) {
            $xpath .= '//item[@name="' . $node . '"]';
        }

        return $xpath;
    }

    private function getValueByXpath($xpath)
    {
        $current = $this->dom->xpath($xpath)[0];

        if ((string)$current == null) {
            return '';
        }

        return (string)$current;
    }
}
